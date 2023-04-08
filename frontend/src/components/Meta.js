import { Helmet, HelmetProvider } from 'react-helmet-async'

// Meta tag.
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
    title: 'MERN Shop',
    description: 'Best and cheap stuff',
    keywords: 'clothing, accessories, shoes, cheap, beautiful, elegant',
}

export default Meta
