const regTemplate = (name,email)=>{
    return `<div>
    <h1 style="color:slateblue">Hii, ${name} Welcome to Cms-v1.0</h1>
    <article style="margin:auto;object-fit:'cover'">
    <img src="https://cdn.pixabay.com/photo/2016/03/31/21/33/greeting-1296493__340.png" width="300"
    height="300"/>
    <h4> We are excited to have you get started with mail id = 
    <span style="color:orangered;"> ${email} </span>, You account is ready to use.</h4> </article>
    </div>`
}

module.exports = regTemplate;