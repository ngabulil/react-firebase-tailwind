import React, { useEffect } from "react";
import ReusableTable from "../components/ReusableTable";
import Action from "../components/Action";
import Modal from "../components/Modal";
import {
  Timestamp,
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
import dayjs from "dayjs";
import Zoom from "react-medium-image-zoom";

const Artikel = () => {
  const [open, setOpen] = React.useState(false);
  const [isEdit, setIsEdit] = React.useState(false);
  const [dataArtikel, setDataArtikel] = React.useState([]);
  const [id, setId] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [deskripsi, setDeskripsi] = React.useState("");
  const [picture, setPicture] = React.useState("");
  const [author, setAuthor] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const articleCollection = collection(db, "articel");
  const inputs = [
    { label: "Judul", value: title, setValue: setTitle, type: "text" },
    {
      label: "Deskripsi",
      value: deskripsi,
      setValue: setDeskripsi,
      type: "textarea",
    },
    {
      label: isEdit ? (picture ? "Ganti Gambar" : "Gambar") : "Gambar",
      value: picture,
      setValue: setPicture,
      type: "file",
    },
    { label: "Author", value: author, setValue: setAuthor, type: "text" },
  ];
  const handleReset = () => {
    setTitle("");
    setDeskripsi("");
    setPicture("");
    setAuthor("");
    setId("");
  };
  const handleSetEdit = (row) => {
    setTitle(row.title || "");
    setDeskripsi(row.deskripsi || "");
    setPicture(row.image || "");
    setAuthor(row.author || "");
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
    const imageRef = ref(storage, `news_photos/${picture.name}`);
    await uploadBytes(imageRef, picture);
  };
  const getImageUrl = async () => {
    if (!picture.name) return;
    const imageRef = ref(storage, `news_photos/${picture.name}`);
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
          await deleteDoc(doc(articleCollection, row.id));
          Swal.fire("Deleted!", "Your file has been deleted.", "success");
          await getArticle();
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
      await updateDoc(doc(articleCollection, id), {
        title,
        author,
        ...(!!pictureUrl && { image: pictureUrl }),
        deskripsi,
        date: Timestamp.now(),
      });
      await getArticle();
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
  const getArticle = async () => {
    setLoading(true);
    try {
      const response = await getDocs(articleCollection);
      const responseData = response.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      const data = responseData.map((v) => {
        const validDate = v?.date?.seconds * 1000;
        return {
          ...v,
          ...(validDate ? { date: new Date(validDate).toISOString() } : {}),
        };
      })
      setDataArtikel(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const createArticle = async () => {
    setLoading(true);
    try {
      await uploadImage();
      const pictureUrl = await getImageUrl();
      await addDoc(articleCollection, {
        title,
        author,
        ...(!!pictureUrl && { image: pictureUrl }),
        deskripsi,
        date: Timestamp.now(),
      });
      await getArticle();
      handleClose();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const columns = [
    { key: "title", title: "Nama" },
    { key: "author", title: "Penulis" },
    {
      key: "image",
      title: "Gambar",
      render: ({ value }) => (
        <Zoom>
          <img className="w-40" src={value} />
        </Zoom>
      ),
    },
    { key: "deskripsi", title: "Deskripsi" },
    {
      key: "date",
      title: "Waktu",
      render: ({ value }) => {
        return <p>{dayjs(value || "").format("DD MMM YYYY HH:mm")}</p>;
      },
    },
    {
      render: ({ row }) => (
        <Action row={row} onDelete={handleDelete} onEdit={handleOpenEdit} />
      ),
    },
  ];
  useEffect(() => {
    getArticle();
  }, []);
  console.log(picture);
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Artikel</h1>
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
          <ReusableTable columns={columns} data={dataArtikel} />
        )}
      </div>
      <Modal
        open={open}
        title={isEdit ? "Edit Artikel" : "Create Artikel"}
        body={<Body inputs={inputs} />}
        onClose={handleClose}
        footer={
          <Footer
            title={isEdit ? "Edit" : "Create"}
            onClick={isEdit ? handleEdit : createArticle}
          />
        }
      />
    </div>
  );
};

export default Artikel;
