const createURL = (path: string) => {
  return window.location.origin + path
}
export const createNewEntry = async (content?: string) => {
  const res = await fetch(
    new Request(createURL('/api/journal'), {
      method: 'POST',
      body: content ? JSON.stringify({ content }) : undefined,
    })
  )
  if (res.ok) {
    const data = await res.json()
    return data?.data
  }
}

export const updateEntry = async (id: string, content: any) => {
  const res = await fetch(
    new Request(createURL(`/api/journal/${id}`), {
      method: 'PATCH',
      body: JSON.stringify({ content }),
    })
  )
  if (res.ok) {
    const data = await res.json()
    return data?.data
  }
}

export const askQuestion = async (question: string) => {
  const res = await fetch(
    new Request(createURL('/api/journal/ask'), {
      method: 'POST',
      body: JSON.stringify({ question }),
    })
  )
  if (res.ok) {
    const data = await res.json()
    return data?.data
  }
}
