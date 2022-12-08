import React, { useContext ,useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { DataContext } from "../../GlobalContext";




const Loading =()=>{
  return <div className="spinner-border text-success" role={'status'}>
    <span className="visually-hidden">Loading..</span>
  </div>
}

function AdminProfile() {
  const context = useContext(DataContext);
  const token = context.token;
  const [currentUser] = context.data.authApi.currentUser;

  const [img, setImg] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleUpload = async (e)=>{

    e.preventDefault()
      try {
        const file = e.target.files[0];
        // console.log('image data=',file)
        // file validation
       if(!file)
          return toast.error("file not exits.. Chose image to upload..")
          // size validation
              
         if(file.size> 1 * 1024 * 1024)
            return toast.warning("file size must be below 1Mb")
            // append in form constructor
            let formData = new FormData()
            formData.append('profileImg', file)
            setLoading(true)
            // post the image to server
            const res = await axios.post(`/api/v1/image/profileImage/upload`, formData ,{
              headers :{
                'Content-Type' :  'multipart/form-data',
                 Authorization: token
              }
            })

            // after upload
            setLoading(false)
            setImg(res.data)

      } catch (err) {
        toast.error(err.response.data.msg)
      }

  }

  const handleDestroy = async (e)=>{
    try {
      if(window.confirm(`Are You sure to delete `)){
        setLoading(true)
        await axios.post(`/api/v1/image/profileImage/delete`,{public_id:img.public_id} , {
          headers:{
            Authorization: token
          }
        })

        setImg(false)
        setLoading(false)
        window.location.href = '/admin/profile'

      }
    } catch (err) {
       toast.error(err.response.data.msg)
    }
  }

  // const submithandler = async (e)=>{}
  return (
    <div className="container">
      <div className="row">
        <div className="col-md-12 text-center">
          <h3 className="display-3">Admin Profile</h3>
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <div className="card">
          <div className="row">
          <div className="col-md-4">
            <div className="card border-0">
              <div className="position-relative">

              {
                img ? (
                  <button onClick={handleDestroy} className="position-absolute top-0 start-100 bg-danger border border-light rounded-circle translate-middle pt-0 ps-2 pe-2 text-white">X</button>
                ):null
              }
            <img src={currentUser.image ? currentUser.image.url: ""} alt="Image_Not_Found"  className="card-img img-fluid"/>

            {
              loading ? <Loading/> :null
            }
              </div>

              



              <div className="card-footer">
              {img ?(
                        <div className="from-group text-center">
                          <button className="btn btn-success ">Save Profile</button>
                        </div>
                      ):(
                        <div className="from-group">
                          <input type="file" name={"profileImg"} id={"profileImg"} className='from-control' onChange={handleUpload} />
                        </div>
                      )}
              </div>
            </div>
                     
            </div>
            <div className="col-md-8">
              <div className="card-body">
                <h4 className="card title text-center text-uppercase text-success">
                          {currentUser.name}
                </h4>
                <hr />
                <p className="cart-text">
                  <strong>Email</strong>
                  <strong className="float-end text-danger">{currentUser.email}</strong>
                </p>
                <p className="cart-text">
                  <strong>Mobile</strong>
                  <strong className="float-end text-danger">{currentUser.mobile}</strong>
                </p>
                <p className="cart-text">
                  <strong>Role</strong>
                  <strong className="float-end text-danger">{currentUser.role}</strong>
                </p>
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminProfile;
