from rest_framework import serializers
from django.contrib.auth import get_user_model

from .models import Message, Conversation, Meetup

User = get_user_model()



class MessageSerializer:

    class MessageCreateSerializer(serializers.ModelSerializer):
        class Meta:
            model = Message
            fields = (
                "content",
                "sender",
                "conversation"
            )

    class MessageRetrieveSerializer(serializers.ModelSerializer):
        is_sender = serializers.SerializerMethodField()

        class Meta:
            model = Message
            fields = ('id', 'content', 'sender', 'created_at', 'is_sender', 'is_read')

        def get_is_sender(self, obj):
            request = self.context.get('request')
            if request and obj.sender == request.user:
                return True
            return False


class ConversationSerializer:

    class ConversationCreateSerializer(serializers.Serializer):
        receiver = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())

        def create(self, validated_data):
            sender = self.context.get('request').user
            receiver = validated_data['receiver']

            try:
                conversation = Conversation.get_room(sender, receiver)
                conversation.save()
            except ValueError:
                raise serializers.ValidationError("There must be at least two users in a conversation.")

            return conversation

        def to_representation(self, instance):
            return {
                "uid": instance.uid
            }
        
    class ConversationListSerializer(serializers.ModelSerializer):
        conversation_partner = serializers.SerializerMethodField()
        content = serializers.SerializerMethodField()
        last_message_time = serializers.SerializerMethodField()
        number_of_unread_messages = serializers.SerializerMethodField()

        class Meta:
            model = Conversation
            fields = (
                "id",
                "uid",
                "conversation_partner",
                "content",
                "last_message_time",
                "number_of_unread_messages",
            )

        def get_conversation_partner(self, obj):
            current_user = self.context.get('request').user
            partner = obj.get_receiver(current_user)
            return {
                "avatar": getattr(partner.profile.profile_image, 'url', None) if partner and partner.profile.profile_image else None,
                "fullname": partner.fullname.strip() or partner.username.strip() or partner.email
            }
        
        def get_content(self, obj):
            last_msg = obj.messages.order_by("-created_at").first()
            return last_msg.content if last_msg else None

        def get_last_message_time(self, obj):
            last_msg = obj.messages.order_by("-created_at").first()
            return last_msg.created_at if last_msg else None

        def get_number_of_unread_messages(self, obj):
            request = self.context.get("request")
            if request:
                return obj.messages.filter(Q(is_read=False) & ~Q(sender=request.user)).count()
            return 0
    
    class ConversationDetailSerializer(serializers.ModelSerializer):

        messages = MessageSerializer.MessageRetrieveSerializer(many=True)
        conversation_partner = serializers.SerializerMethodField()
        class Meta:
            model = Conversation
            fields = (
                "id",
                "messages",
                "conversation_partner"
            )
        
        def get_conversation_partner(self, obj):
            current_user = self.context.get("request").user
            partner = obj.get_receiver(current_user)
            return {
                "avatar": getattr(partner.profile.profile_image, 'url', None) if partner and partner.profile.profile_image else None,
                "fullname": partner.fullname.strip() or partner.username.strip() or partner.email,
                "id": partner.id,
                "uid": partner.uid
            }


class MeetupSerializer:
    class MeetupCreateSerializer(serializers.ModelSerializer):
        class Meta:
            model = Meetup
            fields = (
                "receiver",
                "sender",
                "date",
                "time"
            )