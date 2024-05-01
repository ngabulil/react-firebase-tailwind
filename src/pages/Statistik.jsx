import React from "react";
import VerticalBarChart from "../components/VerticalBarChart";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "../firebase/config/config";
import Modal from "../components/Modal";
import BodyModal from "../components/BodyModal";
import FooterModal from "../components/FooterModal";
import Loading from "../components/Loading";

const convertToDatasets = (data, labels, colors) => {
  return Object.keys(data).map((key, index) => {
    const label = labels[key];
    const value = data[key];
    const backgroundColor = colors[index];

    return {
      label,
      data: [value],
      backgroundColor,
    };
  });
};

const bgColorsEdu = [
  "rgba(255, 99, 132, 0.5)",
  "rgba(54, 162, 235, 0.5)",
  "rgba(255, 206, 86, 0.5)",
  "rgba(75, 192, 192, 0.5)",
  "rgba(153, 102, 255, 0.5)",
];
const bgColorsPenduduk = ["rgba(255, 99, 132, 0.5)", "rgba(54, 162, 235, 0.5)"];
const labelsEdu = {
  sarjana: "Sarjana",
  sd: "SD",
  smp: "SMP",
  sma: "SMA",
  tidak_sekolah: "Tidak Sekolah",
};
const labelsPenduduk = {
  laki: "Laki - Laki",
  wanita: "Wanita",
};

const Statistik = () => {
  const [dataStatistik, setDataStatistik] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [laki, setLaki] = React.useState(0);
  const [wanita, setWanita] = React.useState(0);
  const [sarjana, setSarjana] = React.useState(0);
  const [sd, setSd] = React.useState(0);
  const [smp, setSmp] = React.useState(0);
  const [sma, setSma] = React.useState(0);
  const [openModal, setOpenModal] = React.useState(false);
  const [tidak_sekolah, setTidakSekolah] = React.useState(0);
  const [editPenduduk, setEditPenduduk] = React.useState(false);
  const educationData =
    dataStatistik.length > 0 &&
    convertToDatasets(dataStatistik[0], labelsEdu, bgColorsEdu);
  const pendudukData =
    dataStatistik.length > 0 &&
    convertToDatasets(dataStatistik[1], labelsPenduduk, bgColorsPenduduk);
  const totalEdu =
    dataStatistik.length > 0 &&
    Object.values(dataStatistik[0]).reduce((acc, curr) => acc + curr, 0);
  const totalPenduduk =
    dataStatistik.length > 0 &&
    Object.values(dataStatistik[1]).reduce((acc, curr) => acc + curr, 0);
  const statistikCollection = collection(db, "statistik");
  const inputsEdu = [
    { type: "number", label: "Sarjana", value: sarjana, setValue: setSarjana },
    { type: "number", label: "SD", value: sd, setValue: setSd },
    { type: "number", label: "SMP", value: smp, setValue: setSmp },
    { type: "number", label: "SMA", value: sma, setValue: setSma },
    {
      type: "number",
      label: "Tidak Sekolah",
      value: tidak_sekolah,
      setValue: setTidakSekolah,
    },
  ];
  const inputsPenduduk = [
    { type: "number", label: "Laki - Laki", value: laki, setValue: setLaki },
    { type: "number", label: "Wanita", value: wanita, setValue: setWanita },
  ];
  const handleClose = () => {
    setEditPenduduk(false);
    setOpenModal(false);
  };
  const onEditPenduduk = () => {
    setEditPenduduk(true);
    setOpenModal(true);
    setLaki(dataStatistik[1].laki);
    setWanita(dataStatistik[1].wanita);
  };
  const onEditEdu = () => {
    setOpenModal(true);
    setSd(dataStatistik[0].sd);
    setSmp(dataStatistik[0].smp);
    setSma(dataStatistik[0].sma);
    setSarjana(dataStatistik[0].sarjana);
    setTidakSekolah(dataStatistik[0].tidak_sekolah);
  };
  const handleEditPenduduk = async () => {
    try {
      await updateDoc(doc(db, "statistik", "gender"), {
        laki: Number(laki),
        wanita: Number(wanita),
      });
      await fetchData();
      handleClose();
    } catch (error) {
      console.log(error);
    }
  };
  const handleEditEdu = async () => {
    console.log("dasdasd");
    try {
      await updateDoc(doc(db, "statistik", "education"), {
        sd: Number(sd),
        smp: Number(smp),
        sma: Number(sma),
        sarjana: Number(sarjana),
        tidak_sekolah: Number(tidak_sekolah),
      });
      await fetchData();
      handleClose();
    } catch (error) {
      console.log(error);
    }
  };
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getDocs(statistikCollection);
      const responseData = response.docs.map((doc) => ({
        ...doc.data(),
      }));
      const data = responseData.map(
        ({ sd, smp, sma, sarjana, tidak_sekolah, laki, wanita }) => ({
          ...(tidak_sekolah ? { tidak_sekolah } : {}),
          ...(sd ? { sd } : {}),
          ...(smp ? { smp } : {}),
          ...(sma ? { sma } : {}),
          ...(sarjana ? { sarjana } : {}),
          ...(wanita ? { wanita } : {}),
          ...(laki ? { laki } : {}),
        })
      );
      console.log(data);
      setDataStatistik(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  React.useEffect(() => {
    fetchData();
  }, []);
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Statistik</h1>
      {loading ? (
        <Loading />
      ) : (
        <div>
          <div>
            <div className="mb-6 flex flex-col gap-4">
              <h2 className="text-2xl font-bold">Statistik Pendidikan</h2>
              <div className="flex justify-between items-center">
                <button
                  onClick={onEditEdu}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Edit
                </button>
                <div>
                  <p className="text-xl font-semibold">Total Pendidikan</p>
                  <p className="text-center font-bold text-blue-800 text-xl">
                    {totalEdu}
                  </p>
                </div>
              </div>
              <div className="flex">
                <VerticalBarChart
                  datasets={educationData}
                  labels={["Total Pendidikan"]}
                />
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <h2 className="text-2xl font-bold">Statistik Penduduk</h2>
              <div className="flex justify-between items-center">
                <button
                  onClick={onEditPenduduk}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Edit
                </button>
                <div>
                  <p className="text-xl font-semibold">Total Penduduk</p>
                  <p className="text-center font-bold text-blue-800 text-xl">
                    {totalPenduduk}
                  </p>
                </div>
              </div>
              <div className="flex">
                <VerticalBarChart
                  datasets={pendudukData}
                  labels={["Total Penduduk"]}
                />
              </div>
            </div>
          </div>
        </div>
      )}
      <Modal
        open={openModal}
        onClose={handleClose}
        body={<BodyModal inputs={editPenduduk ? inputsPenduduk : inputsEdu} />}
        footer={
          <FooterModal
            onClick={editPenduduk ? handleEditPenduduk : handleEditEdu}
            title={"Edit"}
          />
        }
        title={
          editPenduduk ? "Edit Statistik Penduduk" : "Edit Statistik Pendidikan"
        }
      />
    </div>
  );
};

export default Statistik;
