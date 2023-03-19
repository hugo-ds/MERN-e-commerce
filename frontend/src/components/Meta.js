import { Helmet, HelmetProvider } from 'react-helmet-async'

const Meta = ({ title, description, keywords }) => {
    return (
        <HelmetProvider>
            <Helmet>
                <title>{title}</title>
                <meta name='description' content={description}></meta>
                <meta name='keyword' content={keywords}></meta>
            </Helmet>
        </HelmetProvider>
    )
}

Meta.defaultProps = {
    title: 'Welcome To Proshop',
    description: 'We sell the best products for cheap',
    keywords: 'electronics, buy electronics, cheap electornics',
}

export default Meta
