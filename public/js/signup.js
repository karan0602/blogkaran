const name = document.querySelector('#name')
const password = document.querySelector('#pass')
const form = document.querySelector('#form')
const error = document.querySelector('#error')
const cpassword = document.querySelector('#cpass')
form.addEventListener('submit' , (e)=>{
    let messages = [] 
    if (password.value != cpassword.value)
    {
        messages.push('* Password must be same')
    }

    if (password.value.length <= 6)
    {
        messages.push('* Password length must be greater than 6')
    }

    if (messages.length >0)
    {
        e.preventDefault()
        error.innerText = messages[messages.length -1]
    }
})