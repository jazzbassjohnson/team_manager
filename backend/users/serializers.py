from django.contrib.auth.models import User
from rest_framework import serializers

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "first_name", "last_name", "email"]
        extra_kwargs = {"password": {"write_only": True}} # should I require this?
        
    def create(self, validated_data):
      user = User.objects.create_user(**validated_data)
      return user