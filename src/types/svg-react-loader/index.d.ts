declare module "!svg-react-loader!*.svg" {
    const svg: (props: React.SVGProps<SVGElement>) => JSX.Element
    export default svg
}
