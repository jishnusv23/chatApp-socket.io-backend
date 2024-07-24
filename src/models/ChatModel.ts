import mongoose,{Schema} from 'mongoose'

const ChatroomSchema=new Schema({
    members:Array,
},{
    timestamps:true
}
)

export default mongoose.model('ChatRoom',ChatroomSchema)