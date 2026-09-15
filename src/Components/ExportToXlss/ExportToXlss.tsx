import { Button } from "@mui/material";
import * as XLSX from "xlsx";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
interface Data {
  SALES_DATA: { date: string; revenue: number }[];
}

export default function ExportToXlss(data: Data) {
  const handeleExport = () => {
    if (data.SALES_DATA.length > 0) {
      const formattedData = data.SALES_DATA.map((item) => ({
        Date: item.date,
        Revenue$: item.revenue,
      }));
      const worksheet = XLSX.utils.json_to_sheet(formattedData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sales Data");
      XLSX.writeFile(workbook, "sales_data.xlsx");
      console.log(formattedData);
    }
  };

  return (
    <Button
      startIcon={<FileDownloadOutlinedIcon />}
      variant="contained"
      color="primary"
      onClick={handeleExport}
      sx={{
        textTransform: "none",
        fontWeight: 600,
        borderRadius: 2,
      }}
    >
      Export to Excel
    </Button>
  );
}
