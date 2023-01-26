// post routerları buraya yazın

const express = require("express");

const Post = require("./posts-model")  // burası database url i buradan al diyoruz 

const server= express();
const router =express.Router();


router.get("/", (req,res)=>{
Post.find()
.then(found=>{
res.json(found)
})
.catch(err=>{
res.status(500).json({
    message:"Gönderiler alınamadı"
})
})

})

router.get("/:id", (req,res)=>{

Post.findById(req.params.id)  // bu fonk bizden id bekliyor bunu da req.params.id den alacağız.
.then(found=>{
    if(!found){
        res.status(404).json({
            message:"Belirtilen ID'li gönderi bulunamadı"
        })
    }
    else{
        res.status(200).json(found)
    }
})
.catch(err=>{
    res.status(500).json({
        message:"Gönderi bilgisi alınamadı"
})
})
})

router.post("/", (req,res)=>{
    const{title,contents}=req.body;

    if(!title || !contents){  //biz postman de title ve content objesi oluşturacağız sorgu atarken,bdoy-json
res.status(400).json({
    message: "Lütfen gönderi için bir title ve contents sağlayın"
})
    }
    else{
        Post.insert({title,contents})  //buranın sonucunda id dönüyor. sonrasında bu id li postu bul diyoruz.
         .then(({id})=>{
             return Post.findById(id)
            
         })
        .then(post=>{
            res.status(201).json(post)  // kullanıcıyı oluşturduğumuz için bunu direkt kullandık ondan boş.
        })
    
        .catch(err=>{
            res.status(500).json({
                message:"Veritabanına kaydedilirken bir hata oluştu"
        })
       
    })
}  // buraya kadar hepsi else in içinde
})

router.delete("/:id", async (req, res) => {
    try {
        const data = await Post.findById(req.params.id)

        if (!data) {
            res.status(404).json({
                message: "Belirtilen ID li gönderi bulunamadı"
            })
        }
        else {
            await Post.remove(req.params.id);  //tekrar await dememizin nedeni bunu yazmassak delete işleminden sonrs get dersek hala görünüyor
            res.status(200).json(data)

            // const a = await Post.remove(req.params.id);  
            // res.status(200).json(a) böyle olunca neden 1 olarak döndü?
        }
    }

    catch (err) {  //  try içinde arrow func. gibi yazmıyoruz.
        res.status(500).json({
            message: "Gönderi silinemedi"
        })
    }

})

router.put("/:id", async(req,res)=>{
try{

    const data = await Post.findById(req.params.id)

    if(!data){
        res.status(404).json({
            message: "Belirtilen ID li gönderi bulunamadı"
        })
    }
    else{
        const{title,contents}=req.body;

        if(!title || !contents){  
    res.status(400).json({
        message: "Lütfen gönderi için bir title ve contents sağlayın"
    })
        }
        else{
           await Post.update(req.params.id,req.body)
            const updateData =await Post.findById(req.params.id)
            res.json(updateData)
        }
    } // else in içi burda bitiyor
    
}
    catch (err) {  //  try içinde arrow func. gibi yazmıyoruz.
        res.status(500).json({
            message: "Gönderi bilgileri güncellenemedi"
        })
    }

})

router.get("/:id/comments", async (req,res)=>{
    try{
const data= await Post.findById(req.params.id)
if(!data){
    res.status(404).json({
        message:"Girilen ID'li gönderi bulunamadı."
    })
}
else{
    const comment= await Post.findPostComments(req.params.id)
    res.json(comment)
}
    }
    catch (err){
        res.status(500).json({
            message: "Yorumlar bilgisi getirilemedi"
        })
    }
})




module.exports = router;