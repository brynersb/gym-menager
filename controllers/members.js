const fs = require('fs')
const data = require("../data.json")
const { age, date } = require("../utils")


exports.index = function (req, res) {

    return res.render("members/index", { members: data.members })
}
//Create

exports.create = function (req, res) {
    return res.render("members/create")
}

//Post
exports.post = function (req, res) {

    const keys = Object.keys(req.body)

    for (key of keys) {

        if (req.body[key] == "") {
            return res.send("Please, Fill all filds")
        }

    }

    birth = Date.parse(req.body.birth)

    //logica para que não haja id repetidos
    let id = 1
    const lestMember = data.members[data.members.length - 1]

    if (lestMember) {
        id = lestMember + 1
    }

    data.members.push({
        id,
        ...req.body,
        birth,


    }) 

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function (err) {

        if (err) {

            return res.send("Write file Error!")
        }

        return res.redirect("/members")
    })

}

//show

exports.show = function (req, res) {

    const { id } = req.params

    const foundMember = data.members.find(function (member) {
        return member.id == id
    })

    if (!foundMember) return res.send("member not found")



    const member = {
        ...foundMember,
        // gender: sexo,
        birth: date(foundMember.birth).birthDay,
        // services: foundMember.services.split(","),

    }

    return res.render("members/show", { member })
}

// pagida de edit

exports.edit = function (req, res) {


    const { id } = req.params

    const foundMember = data.members.find(function (member) {
        return member.id == id
    })

    if (!foundMember) return res.send("member not found")

    const member = {
        ...foundMember,
        birth: date(foundMember.birth).iso,
    }




    return res.render('members/edit', { member })
}

// de fato editar o formulario do usuario

exports.put = function (req, res) {

    const keys = Object.keys(req.body)

    for (key of keys) {

        if (req.body[key] == "") {
            return res.send("Please, Fill all filds")
        }

    }

    const { id } = req.body

    let index = 0

    const foundMember = data.members.find(function (member, foundIndex) {

        if (id == member.id) {
            index = foundIndex
            return true
        }
    })

    if (!foundMember) return res.send("Member Not Found")

    const member = {
        ...foundMember,
        ...req.body,
        birth: Date.parse(req.body.birth),
        id: Number(req.body.id)
    }

    data.members[index] = member

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function (err) {
        if (err) return res.send("Write Error!")

        return res.redirect(`/members/${member.
            id}`)
    })


}

// deletar um formulario de instrutor

exports.delete = function (req, res) {
    const { id } = req.body

    const filteredMembers = data.members.filter(function (member) {
        return member.id != id
    })

    data.members = filteredMembers

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function (err) {

        if (err) return res.send("Write file Error!")

        return res.redirect("/members")
    })
}