import { Button } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { addLeaguage } from '../../feature/Leaguage/LeaguageAPI';

const LeaguageManagement = () => {
    const [formData, setFormData] = useState({
        file: null,
        LeaguageName: '',
        LeaguageAddress:'',
    });
    useEffect(()=>{
        console.log(formData);
        
    },[formData])
    const dispatch = useDispatch();
    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value, files } = e.target;

        
        setFormData({
            ...formData,
            [name]: files ? files[0] : value // if the input type is file, use files[0], otherwise use value
        });
    };
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent the default form submission behavior
        if(formData.LeaguageName.length <=0){        
            
            toast.error("Tên giải không được để trống",{
                theme:"colored",
                position:"bottom-right"
            })
            return;
        }
        if(formData.LeaguageAddress.length <=0){        
            
            toast.error("Địa điểm tổ chức giải không được để trống",{
                theme:"colored",
                position:"bottom-right"
            })
            return;
        }
        let payload = new FormData();
        payload.append("LeaguageName",formData.LeaguageName);
        payload.append("LeaguageAddress",formData.LeaguageAddress);
        payload.append("Capture",formData.file)
        console.log("Form Data:", formData);
        const ret = await dispatch(addLeaguage(payload));
        console.log(ret);
        
        // You can now send formData to your API or perform other actions
    };

    return (
        <div className='d-flex justify-content-around'>
            <div className='d-flex flex-column '>
                <img width={300} height={300} src='https://www.cityofredlands.org/sites/main/files/imagecache/medium/main-images/pickleball_leagues.png?1714726581'></img>
                <span className='text-center'><i>Ảnh giải đấu</i></span>
            </div>
            <div>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formFile" className="mb-3">
                        <Form.Label>Ảnh giải đấu</Form.Label>
                        <Form.Control
                            type="file"
                            name="file"
                            onChange={handleInputChange}
                        />
                    </Form.Group>
                    <Form.Group className='my-2'>
                        <Form.Label>Tên giải đấu</Form.Label>
                        <Form.Control

                            type="text"
                            placeholder="Nhập tên giải đấu"
                            aria-label="Disabled input example"
                            name="LeaguageName"
                            defaultValue={formData.LeaguageName}
                            onChange={handleInputChange}
                        />
                    </Form.Group>
                    <Form.Group className='my-2'>
                        <Form.Label>Địa điểm</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Nhập địa chỉ giải đấu"
                            aria-label="Disabled input example"
                            name="LeaguageAddress"
                            defaultValue={formData.LeaguageAddress}
                            onChange={handleInputChange}
                        />
                    </Form.Group>
                    <Form.Group className='d-flex justify-content-center'>
                    <Button type='submit'>Cập nhật</Button>

                    </Form.Group>
                </Form>
            </div>
        </div>
    )
};
export default LeaguageManagement;