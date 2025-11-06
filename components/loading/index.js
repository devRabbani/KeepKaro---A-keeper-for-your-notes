import s from './fullLoading.module.css'

export default function Loading({ text, full }) {
  return (
    <div className={`${s.body} ${full ? 'full' : ''}`}>
      <div className={s.content}>
        <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
          <circle
            cx="50"
            cy="50"
            fill="none"
            stroke="var(--color-brand-accent)"
            strokeWidth="10"
            r="34"
            strokeDasharray="160.22122533307947 55.40707511102649"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              repeatCount="indefinite"
              dur="0.9174311926605504s"
              values="0 50 50;360 50 50"
              keyTimes="0;1"
            ></animateTransform>
          </circle>
        </svg>
        {text ? <p className={s.subtext}>{text}</p> : null}
      </div>
    </div>
  )
}
