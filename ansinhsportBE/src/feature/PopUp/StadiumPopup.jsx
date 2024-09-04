import { useDispatch } from "react-redux";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "react-bootstrap";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import { toast } from "react-toastify";
import { addLeaguage } from "../Leaguage/LeaguageAPI";
const StadiumPopup = ({ isShow, LeaguageId, isCreateNew, onClose }) => {
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  useEffect(() => {
    // const ret = dispatch(getAllLeaguage());
    // console.log(ret);
  }, [LeaguageId]);

  const [formData, setFormData] = useState({
    file: null,
    LeaguageName: "",
    LeaguageAddress: "",
    StartDate: new Date(),
    EndDate: new Date(),
  });
  useEffect(() => {
    setShow(isShow);
  }, [isShow]);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;

    setFormData({
      ...formData,
      [name]: files ? files[0] : value, // if the input type is file, use files[0], otherwise use value
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    if (formData.LeaguageName.length <= 0) {
      toast.error("Tên giải không được để trống", {
        theme: "colored",
        position: "bottom-right",
      });
      return;
    }
    if (formData.LeaguageAddress.length <= 0) {
      toast.error("Địa điểm tổ chức giải không được để trống", {
        theme: "colored",
        position: "bottom-right",
      });
      return;
    }
    let payload = new FormData();
    payload.append("LeaguageName", formData.LeaguageName);
    payload.append("LeaguageAddress", formData.LeaguageAddress);
    payload.append("Capture", formData.file);
    console.log("Form Data:", formData);
    const ret = await dispatch(addLeaguage(payload));
    console.log(ret);
    if (ret.type === "Leaguage/addLeaguage/fulfilled") {
      toast.success("Thêm mới giải đấu thành công!", { theme: "colored" });
    }
    handleClose();
    // You can now send formData to your API or perform other actions
  };
  // const toggle = () => setShow(!show);
  const handleClose = () => {
    setShow(false);
    onClose();
  };
  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <ModalHeader closeButton className="text-center">
        {isCreateNew ? "Thêm mới giải đấu" : `Thông tin giải đấu`}
      </ModalHeader>
      <ModalBody>
        <div className="d-flex justify-content-around">
          <div className="d-flex flex-column ">
            <img
              width={300}
              height={300}
              src="https://www.cityofredlands.org/sites/main/files/imagecache/medium/main-images/pickleball_leagues.png?1714726581"
            ></img>
            <span className="text-center">
              <i>Ảnh giải đấu</i>
            </span>
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
              <Form.Group className="my-2">
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
              <Form.Group className="my-2">
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
              <Form.Group className="my-2">
                <Form.Label>Ngày khai mạc</Form.Label>
                <Form.Control
                  type="date"
                  placeholder="Nhập ngày khai mạc"
                  aria-label="Disabled input example"
                  name="StartDate"
                  defaultValue={formData.StartDate}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group className="my-2">
                <Form.Label>Ngày bế mạc</Form.Label>
                <Form.Control
                  type="date"
                  placeholder="Nhập ngày bế mạc "
                  aria-label="Disabled input example"
                  name="EndDate"
                  defaultValue={formData.EndDate}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group className="d-flex justify-content-center">
                <Button type="submit">
                  {isCreateNew ? `Thêm mới` : `Cập nhật`}
                </Button>
              </Form.Group>
            </Form>
          </div>
        </div>
      </ModalBody>
      <ModalFooter></ModalFooter>
    </Modal>
  );
};
StadiumPopup.propTypes = {
  isShow: PropTypes.bool,
  LeaguageId: PropTypes.number,
  onClose: PropTypes.func,
  isCreateNew: PropTypes.bool,
  // hasRoleApprove: PropTypes.bool,
};
export default StadiumPopup;
