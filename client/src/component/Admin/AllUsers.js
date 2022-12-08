import axios from 'axios'
import React,{useState,useEffect,useContext} from 'react'
import { toast } from 'react-toastify'
import {DataContext} from '../../GlobalContext'


function AllUsers() {
    const context = useContext(DataContext)
    const token = context.token;
    const [users, setUsers] = useState([])
    const [role, setRole] = useState("")
    const [userId, setUserId] = useState("")

    const readUsers= async()=>{
         const res= await axios.get(`/api/v1/user/allUsers`,{
            headers:{ Authorization :token}
         })

        //  console.log(res.data);
        setUsers(res.data.users)
        // console.log(users);

    }

    useEffect(()=>{
        readUsers()
    },[])


    const handleUpdate= (id)=>{
        // console.log("id =",id)
        const extUser = users.find((user)=> user._id === id)
        console.log("exist user", extUser)
        setRole(extUser.role)
        setUserId(extUser._id)
    }

    const submitHandler = async (e)=>{
        e.preventDefault();
        // update db file
        await axios.patch(`/api/v1/user/changeRole/${userId}`,{role:role} ,{
            headers:{Authorization :token}
        });
        toast.success("user Role update Successfully")
        window.location.href ="/admin/users"
    }
const deleHandler = async (id)=>{
    if (window.confirm(`ary you sure to delete the user?`)) {
     const res =   await axios.delete(`/api/v1/user/delete/${id}` ,{
            headers:{Authorization :token}
        })
        toast.success(res.data.msg)
        window.location.href = "/admin/users"
        
    }else{
        return;
    }
}


  return (
    <div className="container">
        <div className="row">
            <div className="col-md-12 text-center"><h3 className="display-3">ALL Users</h3></div>
        </div>
        <div className="col-md-12 table-responsive">
            <table className='table table-bordered table-striped '>
                <thead>
                    <tr className="text center">
                        <th>Name</th>
                        <th>Email</th>
                        <th>Mobile</th>
                        <th>Role</th>
                        <th>Image</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        users.map((item,index)=>{
                            return(
                                <tr key={index}>
                                    <td>{item.name}</td>
                                    <td>{item.email}</td>
                                    <td>{item.mobile}</td>
                                    <td>{item.role}</td>
                                   <td><img src={item.image.url} alt="noImage found" width={100} height={100} className="img-fluid" /></td>
                                   <td>
                                    <div className="btn-group">
                                    <button onClick={() => handleUpdate(item._id)} data-bs-toggle="modal" data-bs-target="#updateRole" className="btn btn-info"> <i className="bi bi-pen"></i> </button>
                                        <button onClick={()=>deleHandler(item._id)} className="btn btn-danger"><i className="bi bi-trash"></i></button>
                                    </div>
                                    </td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
        </div>
       {/* add model */}

       {/* add modal */}
       <div className="modal fade" id="updateRole" tabIndex={"-1"} >
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3 className="modal-title fs-5" id="updateRoleLabel">Update Role</h3>
                            <button type="button" data-bs-dismiss="modal" className="btn-close"></button>
                        </div>
                        <div className="modal-body">
                            <form autoComplete="off" onSubmit={submitHandler}>
                                <div className="form-group mt-2">
                                    <label htmlFor="role">Choose Role</label>
                                    <select name="role" id="role" value={role} onChange={(e)=>setRole(e.target.value)}  className="form-select">
                                            <option value="student">Student</option>
                                            <option value="trainer">Trainer</option>
                                    </select>
                                </div>
                                <div className="form-group mt-2">
                                    <input type="submit" value="Update" className="btn btn-warning" />
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer"></div>
                    </div>
                </div>
            </div>
        {/* end of modal */}
    </div>

   


  )
}

export default AllUsers