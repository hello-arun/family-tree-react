export class Person {
    /**
     * @param {String} id Id of the person
     * @param {String} name Name of the person
     * @param {String} sex Gender of person m/f
     */
    constructor(id, name, sex) {
        this.id = id
        this.name = name
        this.sex = sex
        this.father = null
        this.mother = null
        this.haveChildren = false // if this person have any children or not
        this.relationships = null
        this.description = {
            "dob": "",
        }

        /**
         * This function add relationship to the person
         * @param {Person} partner PartnerId
         * @param {Person[]} children Children 
         */
        this.addRelationship = (partner, children = null) => {
            if (this.relationships === null) {
                this.relationships = []
            }
            if (partner.relationships === null) {
                partner.relationships = []
            }
            this.relationships.push({
                "partner": partner,
                "children": children
            })
            partner.relationships.push({
                "partner": this,
                "children": children
            })

            this.haveChildren = (this.haveChildren) || children.length ? true : false
            if (children.length) {
                children.forEach(child => {
                    if (this.sex === "m") {
                        child.father = this
                        child.mother = partner
                    } else {
                        child.father = partner
                        child.mother = this
                    }
                });
            }
        }
    }
}