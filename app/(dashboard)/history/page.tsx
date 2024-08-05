
import { getCurrentUser } from "@/utils/auth"
import { prisma } from "@/utils/db";
import HistoryChart from "@/components/HistoryChart"


const getData = async () => {
  const user = await getCurrentUser();
  const analyses = await prisma.analysis.findMany({
    where: {
      userId: user.id
    },
    orderBy: {
      createdAt: 'asc'
    }
  })

  const sum = analyses.reduce((all, current) => all + current.sentimentScore, 0)
  const avg = Math.round(sum / analyses.length);
  return { analyses, avg }
}

const History = async () => {
  const { analyses, avg } = await getData();

  return (
    <div className="w-full h-full">Avg. Sentiment {<HistoryChart data={analyses} />}</div>
  )
}

export default History