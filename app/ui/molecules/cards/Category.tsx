import ReactCurvedText from 'react-curved-text';

type Props = {
  text: string;
  posX?: number;
}
export const Category = ({ text, posX = 60 }: Props) => {
  return (
    <div className="flex-col-center overflow-hidden">
      <div className="object-over w-32 xl:w-52 aspect-product rounded-full bg-container-light" />
      <span className="text-lg mt-6 text-neutral-600">+</span>
      <h3 className="text-md lg:text-[32px] font-accent uppercase mt-2 lg:mt-4 pb-1 text-neutral-600">{text}</h3>
      <div className="h-8 relative hidden">
        {/* @ts-ignore */}
        <ReactCurvedText
          width={200}
          height={200}
          cx={200}
          cy={150}
          rx={100}
          ry={100}
          startOffset={posX}
          reversed={false}
          text={text}
          textProps={{ className: 'uppercase font-accent text-md lg:text-[32px]', style: { letterSpacing: 2 } }}
          textPathProps={{ className: 'fill-neutral-600' }}
          tspanProps={null}
          ellipseProps={null}
          svgProps={{ className: 'absolute bottom-0 inset-x-center w-104 h-64' }}
        />
      </div>
    </div>
  )
}