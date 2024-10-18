import { GeneralLayout } from "../Layout";
import dynamic from 'next/dynamic'


const TrainModel = dynamic(() => import('./TrainModel'), {
  ssr: false,
})


export default function TrainModelComponent({ user }) {
  return (
    <GeneralLayout user={user}>
      <TrainModel />
    </GeneralLayout>
  );
}
