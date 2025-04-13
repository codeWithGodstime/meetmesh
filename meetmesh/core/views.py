from rest_framework import viewsets, permissions
from rest_framework.response import Response
from django.db.models import OuterRef, Subquery

from .serializers import ConversationSerializer, MessageSerializer
from .models import Conversation, Message


class ConversationViewset(viewsets.ModelViewSet):
    queryset = Conversation.objects.all()
    serializer_class = ConversationSerializer.ConversationListSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field ='uid'

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

        return Response(data=dict(message="Conversation Created", uid=conversation.uid))

    def retrieve(self, request, *args, **kwargs):
        conversation = self.get_object() 
        conversation.messages.filter(is_read=False).update(is_read=True)
        serializer = ConversationSerializer.ConversationDetailSerializer(conversation, context={'request': request})
        return Response(serializer.data)
