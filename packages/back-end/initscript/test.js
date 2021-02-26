
db.users.insertMany({
  
        firstName: "Isaac",
        lastName: "Isaac A",
        nonce: 1,
        publicAddress:"0x1b64eb6C911AA4A189ccea856f2cDBFbd750932b",
        role: 1,
        dateOfBirth: new Date("1991-01-28"),
        idNumber: "001001",
        gender: "Male",
        location: "Lagos",
        title:"Mr",
        phoneNumber: "07030628331",
        createdDate: new Date()
}, {firstName: "Gugu",
        lastName: "Nyathi",
        nonce: 1,
        publicAddress:"0x52808427D1bF54554ED984716201C0e3F794Bc96",
        role: 1,
        dateOfBirth: new Date("1982-01-28"),
        idNumber: "001002",
        gender: "Male",
        location: "SA",
        title:"Mr",
        phoneNumber: "+27662968376 ",
        createdDate: new Date()
)}


db.settings.insert({
        patientPercentage:0.15,
        practitionerPercentage: 0.15,
        chwPercentage:0.1,
        exchangeRateUSDZAR:16,
        ratingTypes:[
            {
                title: "How was your experience in accessing Health Services?"
            },
            {
                 title: "How was your experience in accessing/collecting medicines?"
            },
            {
                 title: "How was your experience in pateinr safety of the enviroment ?"
            },
            {
                 title: "How was your experience in cleanliness of  the enviroment ?"
            },
             {
                 title: "How was your experience with the attitude of the staff?"
            },
             {
                 title: "How was your experience in the waiting time ?"
            }
            
            
        ]
        
    })


    db.createUser(
      {
     user: "admin",
      pwd: passwordPrompt(),
     roles: [ { role: "userAdminAnyDatabase", db: "admin" }, "readWriteAnyDatabase" ]
      }
      )

