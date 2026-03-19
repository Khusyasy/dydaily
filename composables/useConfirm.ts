export const useConfirm = () => {
  const isVisible = useState('confirm-is-visible', () => false)
  const title = useState('confirm-title', () => 'Confirm Title')
  const message = useState('confirm-message', () => 'Confirm Message')
  const resolver = useState<((value: boolean) => void) | null>(
    'confirm-resolver',
    () => null
  )

  function open(options: { title: string; message: string }) {
    title.value = options.title
    message.value = options.message
    isVisible.value = true
    return new Promise<boolean>(resolve => {
      resolver.value = resolve
    })
  }

  function confirm() {
    isVisible.value = false
    resolver.value?.(true)
  }

  function cancel() {
    isVisible.value = false
    resolver.value?.(false)
  }

  return {
    isVisible,
    title,
    message,
    open,
    confirm,
    cancel,
  }
}
