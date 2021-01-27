
const ChatMessageSchema = new Schema({
    sender:{
        type: Schema.Types.ObjectId,
        ref: 'sender',
    },
    receiver:{
        type: Schema.Types.ObjectId,
        ref: 'receiver',
    },
    text:{
        type: String,
        required: true,
    },
});

module.exports = ChatMessage = mongoose.model('chatMessage', ChatMessageSchema);