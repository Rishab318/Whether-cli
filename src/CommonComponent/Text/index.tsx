import { TextProps } from '@/Types/CommonComponent.type';
import React, { FC } from 'react'

const Text:FC<TextProps> = ({title, className}) => {
  return (
    <span className={className}>{title}</span>
  )
}

export default Text;