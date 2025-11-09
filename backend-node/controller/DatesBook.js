import DateBook from '../model/DatesBook.js'

export const AddDateBook = async (req, res) => {
   console.log(req.body)
 try{      
      const newVol = new DateBook({
        date: req.body.date,
        reason: req.body.reason,
        time: req.body.time,
        email: req.body.email
      });

      const newV = await newVol.save();
      console.log(newVol);
      if (newV) {
      
        res.status(201).json({
          message: "Book Created Sucessfull..!",
          payload: newV
        })
      } else {

        res.status(400).json({
          message: "Somthing Went Wrong In Post Creating..!"
        })
      } 
  } catch (error) {
    res.status(500).json({
      message: "Somthing Went Wrong..!",
      error: error
    })
  }
}
