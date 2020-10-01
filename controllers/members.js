const fs = require('fs')
const data = require("../data.json")
const { age, date } = require("../utils")


exports.index = function (req, res) {

    return res.render("members/index", { members: data.members })
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
        age: age(foundMember.birth),
        services: foundMember.services.split(","),
        created_at: new Intl.DateTimeFormat("pt-BR").format(foundMember.created_at),
    }

    return res.render("members/show", { member })
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

    let { avatar_url, birth, name, services, gender } = req.body

    birth = Date.parse(req.body.birth)
    const created_at = Date.now()
    const id = Number(data.members.length + 1)

    //[]

    data.members.push({
        id,
        name,
        gender,
        services,
        avatar_url,
        birth,
        created_at
    }) //[{...}]

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function (err) {

        if (err) {

            return res.send("Write file Error!")
        }

        return res.redirect("/members")
    })

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
        birth: date(foundMember.birth),
    }




    return res.render('members/edit', { member })
}

// de fato editar o formulario do usuario

exports.put = function (req, res) {

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