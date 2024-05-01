import React, { useEffect } from "react";
import ReusableTable from "../components/ReusableTable";
import Action from "../components/Action";
import Modal from "../components/Modal";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "../firebase/config/config";
import Loading from "../components/Loading";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import Swal from "sweetalert2";
import Body from "../components/BodyModal";
import Footer from "../components/FooterModal";

const UMKM = () => {
  const [open, setOpen] = React.useState(false);
  const [isEdit, setIsEdit] = React.useState(false);
  const [dataUmkm, setDataUmkm] = React.useState([]);
  const [id, setId] = React.useState("");
  const [name, setName] = React.useState("");
  const [deskripsi, setDeskripsi] = React.useState("");
  const [jamOperasional, setJamOperasional] = React.useState("");
  const [picture, setPicture] = React.useState("");
  const [alamat, setAlamat] = React.useState("");
  const [nomorTelp, setNomorTelp] = React.useState(0);
  const [harga, setHarga] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const umkmCollection = collection(db, "umkm");
  const inputs = [
    { label: "Name", value: name, setValue: setName, type: "text" },
    {
      label: "Deskripsi",
      value: deskripsi,
      setValue: setDeskripsi,
      type: "text",
    },
    {
      label: "Jam Operasional",
      value: jamOperasional,
      setValue: setJamOperasional,
      type: "text",
    },
    {
      label: isEdit ? (picture ? "Ganti Gambar" : "Gambar") : "Gambar",
      value: picture,
      setValue: setPicture,
      type: "file",
    },
    { label: "Alamat", value: alamat, setValue: setAlamat, type: "text" },
    {
      label: "Nomor Telp",
      value: nomorTelp,
      setValue: setNomorTelp,
      type: "number",
    },
    { label: "Kategori", value: category, setValue: setCategory, type: "text" },
    { label: "Harga", value: harga, setValue: setHarga, type: "text" },
  ];
  const handleReset = () => {
    setName("");
    setDeskripsi("");
    setJamOperasional("");
    setPicture("");
    setAlamat("");
    setNomorTelp(0);
    setHarga("");
    setCategory("");
    setId("");
  };
  const handleSetEdit = (row) => {
    setName(row.name || "");
    setDeskripsi(row.deskripsi || "");
    setJamOperasional(row.jam_operasional || "");
    setPicture(row.image || "");
    setAlamat(row.alamat || "");
    setNomorTelp(row.nomor_telp || "");
    setHarga(row.harga || "");
    setCategory(row.kategori || "");
    setId(row.id);
    setIsEdit(true);
  };
  const handleClose = () => {
    setOpen(false);
    setIsEdit(false);
    handleReset();
  };
  const uploadImage = async () => {
    if (!picture.name) return;
    const imageRef = ref(storage, `umkm_photos/${picture.name}`);
    await uploadBytes(imageRef, picture);
  };
  const getImageUrl = async () => {
    if (!picture.name) return;
    const imageRef = ref(storage, `umkm_photos/${picture.name}`);
    const url = await getDownloadURL(imageRef);
    return url;
  };
  const handleOpen = () => setOpen(true);
  const handleDelete = async (row) => {
    await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteDoc(doc(umkmCollection, row.id));
          Swal.fire("Deleted!", "Your file has been deleted.", "success");
          await getUmkm();
        } catch (error) {
          console.log(error);
        }
      }
    });
  };
  const handleEdit = async () => {
    try {
      await uploadImage();
      const pictureUrl = await getImageUrl();
      await updateDoc(doc(umkmCollection, id), {
        name,
        harga,
        jam_op: jamOperasional,
        kategori: category,
        ...(!!pictureUrl && { image: pictureUrl }),
        deskripsi,
        alamat,
        no_tlp: nomorTelp,
      });
      await getUmkm();
      handleClose();
    } catch (error) {
      console.log(error);
    }
  };
  const handleOpenEdit = (row) => {
    handleOpen();
    setIsEdit(true);
    handleSetEdit(row);
  };
  const getUmkm = async () => {
    setLoading(true);
    try {
      const response = await getDocs(umkmCollection);
      const responseData = response.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setDataUmkm(responseData);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const createUmkm = async () => {
    setLoading(true);
    try {
      await uploadImage();
      const pictureUrl = await getImageUrl();
      await addDoc(umkmCollection, {
        name,
        harga,
        jam_op: jamOperasional,
        kategori: category,
        ...(!!pictureUrl && { image: pictureUrl }),
        deskripsi,
        alamat,
        no_tlp: nomorTelp,
      });
      await getUmkm();
      handleClose();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const columns = [
    
    { key: "name", title: "Nama" },
    { key: "harga", title: "Harga" },
    { key: "jam_op", title: "Jam Operasional" },
    { key: "kategori", title: "Kategori" },
    {
      key: "image",
      title: "Gambar",
      render: ({ value }) => <img className="w-40" src={value} />,
    },
    { key: "alamat", title: "Alamat" },
    { key: "no_tlp", title: "Nomor Telp" },
    { key: "deskripsi", title: "Deskripsi" },
    {
      render: ({ row }) => (
        <Action row={row} onDelete={handleDelete} onEdit={handleOpenEdit} />
      ),
    },
  ];
  console.log(dataUmkm);
  useEffect(() => {
    getUmkm();
  }, []);
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">UMKM</h1>
      <div className="flex">
        <button
          onClick={handleOpen}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-2 ml-auto"
        >
          Tambah
        </button>
      </div>
      <div>
        {loading ? (
          <Loading />
        ) : (
          <ReusableTable columns={columns} data={dataUmkm} />
        )}
      </div>
      <Modal
        open={open}
        title={isEdit ? "Edit UMKM" : "Create UMKM"}
        body={<Body inputs={inputs} />}
        onClose={handleClose}
        footer={
          <Footer
            title={isEdit ? "Edit" : "Create"}
            onClick={isEdit ? handleEdit : createUmkm}
          />
        }
      />
    </div>
  );
};

export default UMKM;
