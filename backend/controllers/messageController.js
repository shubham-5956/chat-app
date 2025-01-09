
export const sendMessage = async(req,res)=>{
    try{
        const senderId  = req.id;
        const receiverId = req.params.id;
        const {message} = req.body;

        let gotConversation = await Conversation.findOne({
            participants:{$all : [senderId, receiverId]},
        });

        if(!gotConversation){
            gotConversation= await Conversation.create({
                participants:[senderId, receiverId]
            })
        }

    }catch(error){
        console.log(error);
    }
}