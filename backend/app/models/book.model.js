module.exports = mongoose => {
    const Tutorial = mongoose.model(
      "book",
      mongoose.Schema(
        {
          title: String,
          id: Number,
          author: String,
          description: String,
        },
        { timestamps: true }
      )
    );
  
    return Tutorial;
  };