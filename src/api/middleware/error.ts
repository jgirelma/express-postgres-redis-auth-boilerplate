
export const errorMiddleware = (error:any,_req:any, res:any, _next:any) => {
  res.status(500).json({message:error.message || "Server Error"})
}

