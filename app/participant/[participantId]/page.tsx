import styles from "./page.module.css";

export default async function ParticipantDetail({
                                                    params,
                                                }: {
    params: Promise<{ participantId: string }>
}) {
    const {participantId} = await params
    return <h1>Hello {participantId}</h1>
}