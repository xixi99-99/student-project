const mongoose = require("mongoose")

// 1. 建立 new Schema object 並儲存在 studentShema 變數中
const studentSchema = new mongoose.Schema({ //大寫S
  id: {
    type: Number,
    require: true,
  },
  name: {
    type: String,
    require: true,
  },
  age: {
    type: Number,
    default: 18,
    max: [80, "Too old in this school"],
  },
  scholarship: {
    merit: {
      type: Number,
      min: 0, //獎學金不能為負
      max: [5000, "Too much merit sholarship"],
    },
    other: {
      type: Number,
      min: 0,
    }
  }
})

//2. 建立mongoose model
const Student = mongoose.model("Student", studentSchema)

//3. 輸出成模組
module.exports = Student