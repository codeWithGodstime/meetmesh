from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import OuterRef, Subquery, Count

from .serializers import ConversationSerializer, MeetupSerializer
from .models import Conversation, Message, Meetup


class MeetupRequestViewset(viewsets.ModelViewSet):
    queryset = Meetup.objects.all()
    serializer_class = MeetupSerializer.MeetupCreateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        Override the default queryset to return meetups specific to the current user
        if the user is not an admin.
        """
        user = self.request.user

        if user.is_superuser:
            return Meetup.objects.all()

        return Meetup.objects.filter(receiver__user=user)

    @action(methods=['post'], detail=True, permission_classes=[permissions.IsAuthenticated])
    def update_meetup_status(self, request, *args, **kwargs):
        meetup_request = self.get_object()

        if meetup_request.receiver != request.user.profile:
            return Response(
                {"detail": "You are not authorized to modify this request."},
                status=status.HTTP_403_FORBIDDEN
            )

        action = request.data.get("action")

        if action not in ['accept', 'decline']:
            return Response(
                {"detail": "Invalid action. Please provide 'accept' or 'decline'."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if action == 'accept':
            meetup_request.status = 'accepted'
        elif action == 'decline':
            meetup_request.status = 'rejected'

        meetup_request.save()

        return Response(
            MeetupSerializer.MeetupCreateSerializer(meetup_request).data,
            status=status.HTTP_200_OK
        )

class ConversationViewset(viewsets.ModelViewSet):
    queryset = Conversation.objects.all()
    serializer_class = ConversationSerializer.ConversationListSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field ='id'

    def list(self, request, *args, **kwargs):
        latest_message_time = Subquery(
            Message.objects.filter(conversation=OuterRef('pk'))
            .order_by('-created_at')
            .values('created_at')[:1]
        )

        queryset = self.get_queryset().filter(
            participants=request.user
        ).annotate(
            message_count=Count('messages'),
            last_message_time=latest_message_time
        ).filter(
            message_count__gt=0
        ).order_by('-last_message_time')

        self.queryset = queryset

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True, context={'request': request})
        return super().list(request, *args, **kwargs)


    def create(self, request, *args, **kwargs):
        current_user = request.user
        receiver = request.data['receiver']

        serializer = ConversationSerializer.ConversationCreateSerializer(
            data=dict(
                receiver=receiver,
            ),
            context={'request': request}
        )
        serializer.is_valid(raise_exception=True)
        conversation = serializer.save()

        return Response(data=dict(message="Conversation Created", id=conversation.id))

    def retrieve(self, request, *args, **kwargs):
        conversation = self.get_object() 
        conversation.messages.filter(is_read=False).update(is_read=True)
        serializer = ConversationSerializer.ConversationDetailSerializer(conversation, context={'request': request})
        return Response(serializer.data)
