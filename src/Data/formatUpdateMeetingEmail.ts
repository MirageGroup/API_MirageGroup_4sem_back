
export function formatUpdateMeetingEmail(meeting: any): string{
    return `
    OLA, A REUNIÃO EM QUE VOCE ESTAVA PARTICIPANDO FOI ATUALIZADA COM SUCESSO.


      Detalhes da Reunião:
      Protocolo: ${meeting.protocol}
      Descrição: ${meeting.description}
      Início: ${meeting.beginning_time}
      Fim: ${meeting.end_time}
      Tipo de Reunião: ${meeting.meetingType}
      Participantes: ${meeting.participants.map((participant: { name: any; }) => participant.name).join(', ')}
      Sala Física: ${meeting.physicalRoom ? meeting.physicalRoom.name : 'N/A'}
      Sala Virtual: ${meeting.virtualRoom ? meeting.physicalRoom.name : 'N/A'}
      Temas da Reunião: ${meeting.meetingTheme ? meeting.meetingTheme.join(', ') : 'N/A'}
    `;
  };

  export function formatCreateMeetingEmail(meeting: any): string{
    return `
    OLA, A REUNIÁO FOI CRIADA COM SUCESSO.

    Detalhes da Reunião:
    Protocolo: ${meeting.protocol}
    Descrição: ${meeting.description}
    Início: ${meeting.beginning_time}
    Fim: ${meeting.end_time}
    Tipo de Reunião: ${meeting.meetingType}
    Participantes: ${meeting.participants.map((participant: { name: any; }) => participant.name).join(', ')}
    Sala Física: ${meeting.physicalRoom ? meeting.physicalRoom.name : 'N/A'}
    Sala Virtual: ${meeting.virtualRoom ? meeting.virtualRoom.id : 'N/A'}
    Temas da Reunião: ${meeting.meetingTheme ? meeting.meetingTheme.join(', ') : 'N/A'}
  `;
  }