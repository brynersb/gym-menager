const fs = require('fs')
const data = require("./data.json")
const { age, date } = require("./utils")

//show

exports.show = function (req, res) {

    const { id } = req.params

    const foundInstructor = data.instructors.find(function (instructor) {
        return instructor.id == id
    })

    if (!foundInstructor) return res.send("instructor not found")

    //logica de transformar o sexo guardada pra brincar depois   
    // function trasnformGender (x){

    //     let sexo = x

    //     if (sexo == "M") {

    //         return sexo = "masculino"

    //     }
    //     else{
    //         return sexo = "feminino"
    //     }
    // }

    // const sexo = trasnformGender(foundInstructor.gender)

    const instructor = {
        ...foundInstructor,
        // gender: sexo,
        age: age(foundInstructor.birth),
        services: foundInstructor.services.split(","),
        created_at: new Intl.DateTimeFormat("pt-BR").format(foundInstructor.created_at),
    }

    return res.render("instructors/show", { instructor })
}

//create
exports.post = function (req, res) {

    const keys = Object.keys(req.body)

    for (key of keys) {

        if (req.body[key] == "") {
            return res.send("Please, Fill all filds")
        }

    }

    let { avatar_url, birth, name, services, gender } = req.body

    birth = Date.parse(req.body.birth)
    const created_at = Date.now()
    const id = Number(data.instructors.length + 1)

    //[]

    data.instructors.push({
        id,
        name,
        gender,
        services,
        avatar_url,
        birth,
        created_at
    }) //[{...}]

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function (err) {

        if (err) return res.send("Write file Error!")

        return res.redirect("/instructors")
    })

    // return res.send(req.body)
}

// pagida de edit

exports.edit = function (req, res) {
    const { id } = req.params

    const foundInstructor = data.instructors.find(function (instructor) {
        return instructor.id == id
    })

    if (!foundInstructor) return res.send("instructor not found")

    const instructor = {
        ...foundInstructor,
        birth: date(foundInstructor.birth)
    }




    return res.render('instructors/edit', { instructor })
}

// de fato editar o formulario do usuario

exports.put = function (req, res) {

    const { id } = req.body

    let index = 0

    const foundInstructor = data.instructors.find(function (instructor, foundIndex) {

        if (id == instructor.id) {
            index = foundIndex
            return true
        }
    })

    if (!foundInstructor) return res.send("Instructor Not Found")

    const instructor = {
        ...foundInstructor,
        ...req.body,
        birth: Date.parse(req.body.birth)
    }

    data.instructors[index] = instructor

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function (err) {
        if (err) return res.send("Write Error!")

        return res.redirect(`/instructors/${instructor.
            id}`)
    })


}

// deletar um formulario de instrutor

exports.delete = function (req, res) {
    const { id } = req.body

    const filteredInstructors = data.instructors.filter(function (instructor) {
        return instructor.id != id
    })

    data.instructors = filteredInstructors

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function (err) {

        if (err) return res.send("Write file Error!")

        return res.redirect("/instructors")
    })
}