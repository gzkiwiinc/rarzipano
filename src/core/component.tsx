import * as React from "react";
import { MarzipanoContext, Context } from './context';
export const isDev = process.env.NODE_ENV === 'development'

export type EventkeyMap<T, P> = { [K in keyof P]?: keyof T };

export interface Options<Props>
{
	provider?: boolean;
	marzipanoProps?: (keyof Props)[];
	marzipanoReadonlyProps?: (keyof Props)[];
}

export interface MarzipanoComponentOption<Props> extends Options<Props>
{
}

export interface MarzipanoComponentChildContext
{
	marzipanoContext: any;
	onRegisterProvide?: (provide: Context) => void
}

export type MarziapnoComponentType<P, S> = React.Component<P, S>;

interface State
{
	mounted: boolean;
	provide: Context | null;
}

export const createMarzipanoComponent = <Props, ComponentRef = any>(
	WrappedComponent: any,
	opts?: MarzipanoComponentOption<Props>,
) =>
{
	class MarzipanoComponent extends React.Component<Props & { forwardedRef: React.Ref<ComponentRef> }, State> {
		static contextType = MarzipanoContext
		constructor(props: Props & { forwardedRef: React.Ref<ComponentRef> }, context: any)
		{
			super(props)
			this.state = {
				mounted: false,
				provide: context,
			}
		}
		public componentDidMount()
		{
			this.create()
		}

		public componentDidUpdate(prevProps: Props)
		{
			if (!this.state.mounted)
			{
				this.create()
			}
			const readOnlyPropsChange = opts && opts.marzipanoReadonlyProps && opts.marzipanoReadonlyProps.some(item =>
			{
				isDev && this.props[item] !== prevProps[item] && console.log(`Component ${WrappedComponent.name} readOnlyProps(${item}) change, remount ${WrappedComponent.name} `);
				return this.props[item] !== prevProps[item]
			})
			if (readOnlyPropsChange)
			{
				this.destory()
			}
		}

		public componentWillUnmount()
		{
			this.destory()
		}

		private create()
		{
			this.setState({
				mounted: true
			})
		}

		private destory()
		{
			this.setState({
				mounted: false
			})
		}

		private registerProvide(provide: Context)
		{
			if (opts && opts.provider)
			{
				this.setState({ provide: { ...this.context, ...provide } })
			}
		}

		public render()
		{
			if (!this.state.mounted)
			{
				return null
			}
			else
			{
				const children = this.props.children || null
				return (
					<WrappedComponent
						ref={this.props.forwardedRef}
						{...this.props}
						marzipanoContext={this.context}
						// tslint:disable-next-line jsx-no-bind
						onRegisterProvide={this.registerProvide.bind(this)}
					>
						{
							opts && opts.provider ? <MarzipanoContext.Provider value={this.state.provide}>
								{children}
							</MarzipanoContext.Provider> : children
						}
					</WrappedComponent>
				)
			}
		}
	}

	return React.forwardRef<ComponentRef, React.PropsWithChildren<Props>>((props, ref) =>
	{
		return <MarzipanoComponent {...props} forwardedRef={ref} />;
	})
}

export default createMarzipanoComponent;
