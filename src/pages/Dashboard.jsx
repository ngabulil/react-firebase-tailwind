import React from "react";
import DoughnutChart from "../components/DoughnutChart";
import { FaAddressBook } from "react-icons/fa";
import BoxStatus from "../components/BoxStatus";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config/config";
import Loading from "../components/Loading";

const Dashboard = () => {
  const [loading, setLoading] = React.useState(false);
  const [pengaduan, setPengaduan] = React.useState([]);
  const pengaduanBelum = pengaduan.filter((item) => item.status === 1);
  const pengaduanDiproses = pengaduan.filter((item) => item.status === 2);
  const pengaduanSelesai = pengaduan.filter((item) => item.status === 3);
  const laporanCollection = collection(db, "laporan");
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getDocs(laporanCollection);
      const responseData = response.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      // console.log(responseData);
      setPengaduan(responseData);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const data = [
    {
      bodyColor: "bg-red-600",
      bottomColor: "bg-red-900",
      Icon: <FaAddressBook size={60} />,
      bodyLabel: "Pengaduan",
      bottomLabel: "Total Belum Diproses",
      value: pengaduanBelum.length,
    },
    {
      bodyColor: "bg-yellow-600",
      bottomColor: "bg-yellow-900",
      Icon: <FaAddressBook size={60} />,
      bodyLabel: "Pengaduan",
      bottomLabel: "Total Diproses",
      value: pengaduanDiproses.length,
    },
    {
      bodyColor: "bg-green-600",
      bottomColor: "bg-green-900",
      Icon: <FaAddressBook size={60} />,
      bodyLabel: "Pengaduan",
      bottomLabel: "Total Selesai",
      value: pengaduanSelesai.length,
    },
  ];

  React.useEffect(() => {
    fetchData();
  }, []);
  return (
    <div className="flex flex-col">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="mb-4">
            <h2 className="text-xl font-bold mb-2">Status Pengaduan</h2>
            <div className="grid grid-cols-3 gap-6">
              {data.map((item) => (
                <BoxStatus {...item} />
              ))}
            </div>
          </div>
          <div className="">
            <h2 className="text-xl font-bold">Total Layanan</h2>
            <div className="flex justify-center">
              <div className="w-1/2 h-[500px]">
                <DoughnutChart
                  dataArray={[
                    pengaduanBelum.length,
                    pengaduanDiproses.length,
                    pengaduanSelesai.length,
                  ]}
                  label={"Pengaduan"}
                  labels={["Belum Diproses", "Diproses", "Selesai"]}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
