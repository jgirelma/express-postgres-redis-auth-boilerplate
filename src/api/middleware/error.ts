
export const errorMiddleware = (error:any,_req:any, res:any, _next:any) => {
  console.log(error)
  res.status(500).json({message:error.message || "Server Error"})
}

