import React from "react";
import Loading from "../components/Loading";
import Swal from "sweetalert2";
import { collection, doc, getDocs, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/config/config";
import Select from "../components/Select";
import ReusableTable from "../components/ReusableTable";
import dayjs from "dayjs";
import Action from "../components/Action";
import Modal from "../components/Modal";
import BodyModal from "../components/BodyModal";
import FooterModal from "../components/FooterModal";

const Pengaduan = () => {
  const [loading, setLoading] = React.useState(false);
  const [laporan, setLaporan] = React.useState([]);
  const [openModal, setOpenModal] = React.useState(false);
  const [deskripsi, setDeskripsi] = React.useState("");
  const [idPengaduan, setIdPengaduan] = React.useState("");
  const [isProses, setIsProses] = React.useState(false);
  const [filteredLaporan, setFilteredLaporan] = React.useState([]);
  const [option, setOption] = React.useState(0);
  const laporanCollection = collection(db, "laporan");
  const tanggapanCollection = collection(db, "tanggapan");
  const options = [
    { value: 0, label: "Semua" },
    { value: 1, label: "Belum Diproses" },
    { value: 2, label: "Diproses" },
    { value: 3, label: "Selesai" },
  ];
  const handleChangeOption = (e) => {
    setOption(e.target.value);
  };
  const columns = [
    {
      key: "photo",
      title: "Foto",
      render: ({ row }) => (
        <img
          src={row.photo}
          alt={row.name}
          className="w-14 h-14 rounded-full"
        />
      ),
    },
    {
      key: "date",
      title: "Waktu",
      render: ({ value }) => <p>{dayjs(value).format("DD MMM YYYY, HH:mm")}</p>,
    },
    {
      key: "value",
      title: "Deskripsi",
    },
    {
      key: "status",
      title: "Status",
      render: ({ value }) => {
        if (value === 1) {
          return <span className="text-red-500">Belum diproses</span>;
        } else if (value === 2) {
          return <span className="text-yellow-500">Sedang diproses</span>;
        } else if (value === 3) {
          return <span className="text-green-500">Selesai</span>;
        }
        return <span className="text-red-500">{value}</span>;
      },
    },
    {
      title: "Action",
      render: ({ row }) => {
        if (row.status == 1) {
          return (
            <Action
              hideDelete
              onEdit={() => actionProses(row.id)}
              labelEdit={"Proses"}
              classEdit={{
                className:
                  "bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded mr-2",
              }}
            />
          );
        } else if (row.status == 2) {
          return (
            <Action
              hideDelete
              onEdit={() => actionSelesai(row.id)}
              labelEdit={"Selesai"}
              classEdit={{
                className:
                  "bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2",
              }}
            />
          );
        } else if (row.status == 3) {
          return <p className="text-green-500">Pengaduan Telah Selesai</p>;
        } else {
          return (
            <Action
              hideDelete
              onEdit={() => actionProses(row.id)}
              labelEdit={"Proses"}
              classEdit={{
                className:
                  "bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded mr-2",
              }}
            />
          );
        }
      },
    },
  ];
  const inputs = [
    {
      label: "Deskripsi",
      value: deskripsi,
      type: "text",
      setValue: setDeskripsi,
    }
  ]
  const actionSelesai = (id) => {
    handleOpen()
    setIdPengaduan(id)
  }
  const actionProses = (id) => {
    handleOpen()
    setIsProses(true)
    setIdPengaduan(id)
  }
  const getLaporan = async () => {
    setOption(0);
    setLoading(true);
    try {
      const response = await getDocs(laporanCollection);
      const responseData = response.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      handleClose()
      setLaporan(responseData);
      setFilteredLaporan(responseData);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const handleProses = async () => {
    await Swal.fire({
      title: "Apakah anda yakin?",
      text: "Anda akan memproses pengaduan ini",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, Proses",
    })
      .then(async (result) => {
        if (result.isConfirmed) {
          setLoading(true);
          try {
            await setDoc(doc(tanggapanCollection, idPengaduan), {
              deskripsi,
              id_pengaduan: idPengaduan,
              status: 2,
            })
            await updateDoc(doc(laporanCollection, idPengaduan), {
              status: 2,
            });
            await getLaporan();
          } catch (error) {
            console.log(error);
            throw error;
          }
          Swal.fire("Berhasil!");
        }
      })
      .catch((error) => {
        console.log(error);
        Swal.fire("Gagal!");
      });
  };
  const handleSelesai = async () => {
    await Swal.fire({
      title: "Apakah anda yakin?",
      text: "Anda akan menyelesaikan pengaduan ini",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, Selesaikan",
    })
      .then(async (result) => {
        if (result.isConfirmed) {
          setLoading(true);
          try {
            await updateDoc(doc(tanggapanCollection, idPengaduan), {
              deskripsi,
              id_pengaduan: idPengaduan,
              status: 3,
            })
            await updateDoc(doc(laporanCollection, idPengaduan), {
              status: 3,
            });
            await getLaporan();
          } catch (error) {
            console.log(error);
            throw error;
          }
          Swal.fire("Berhasil!");
        }
      })
      .catch((error) => {
        console.log(error);
        Swal.fire("Gagal!");
      });
  };
  const handleClose = () => {
    setOpenModal(false);
    setIsProses(false);
    setDeskripsi("");
    setIdPengaduan("");
  }
  const handleOpen = () => {
    setOpenModal(true);
  }
  React.useEffect(() => {
    getLaporan();
  }, []);
  React.useEffect(() => {
    if (option == 0) {
      setFilteredLaporan(laporan);
    } else if (option == 1) {
      setFilteredLaporan(laporan.filter((item) => item.status === 1 || !item.status));
    } else if (option == 2) {
      setFilteredLaporan(laporan.filter((item) => item.status === 2));
    } else if (option == 3) {
      setFilteredLaporan(laporan.filter((item) => item.status === 3));
    }
  }, [option]);
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Pengaduan</h1>
      <div className="flex">
        <Select
          onChange={handleChangeOption}
          options={options}
          value={option}
        />
      </div>
      <div>
        {loading ? (
          <Loading />
        ) : (
          <ReusableTable columns={columns} data={filteredLaporan} />
        )}
      </div>
      <Modal body={<BodyModal inputs={inputs} />} footer={<FooterModal title={"Submit"} onClick={isProses ? handleProses : handleSelesai} />} onClose={handleClose} open={openModal} title={"Masukkan Tanggapan"} />
    </div>
  );
};

export default Pengaduan;
