import { RouterProvider, createBrowserRouter, } from "react-router";
import Landing from "./pages/Landing";

const router = createBrowserRouter([
  {
    path:"/",
    element: <Landing/>
  },
])

function App(){
  return(
    <RouterProvider router={router}/>
  )
}

export default App
