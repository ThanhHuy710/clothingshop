import { useInView } from '../../hooks/useInView';

export function FadeIn({ children, delay = 0, direction = 'up', className = '' }) {
  const { ref, isInView } = useInView({ threshold: 0.1, triggerOnce: true });

  let translateClass = 'translate-y-6';
  if (direction === 'none') translateClass = '';
  else if (direction === 'left') translateClass = 'translate-x-6';
  else if (direction === 'right') translateClass = '-translate-x-6';

  return (
    <div
      ref={ref}
      style={{ transitionDelay: delay + 'ms' }}
      className={"transition-all duration-700 ease-out motion-reduce:transition-none motion-reduce:transform-none motion-reduce:opacity-100 " +
        (isInView ? 'opacity-100 translate-y-0 translate-x-0' : 'opacity-0 ' + translateClass) + ' ' + className}
    >
      {children}
    </div>
  );
}
