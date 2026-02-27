/**
 * Created by nan on 2021/9/2
 */
Ext.define('CGP.pcresourcelibrary.config.Config', {
    statics: {
        IPCResourceType: [
            {
                display: 'CMYKColor',
                value: 'com.qpp.cgp.domain.pcresource.color.CMYKColor',
                url: adminPath + 'api/pcResource/colors'
            },
            {
                display: 'RGBColor',
                value: 'com.qpp.cgp.domain.pcresource.color.RGBColor',
                url: adminPath + 'api/pcResource/colors'

            },
            {
                display: 'SpotColor',
                value: 'com.qpp.cgp.domain.pcresource.color.SpotColor',
                url: adminPath + 'api/pcResource/colors'
            },
            {
                display: 'Font',
                value: 'com.qpp.cgp.domain.pcresource.font.Font',
                url: adminPath + 'api/pcResource/fonts'
            },
            {
                display: 'Ornament',
                value: 'com.qpp.cgp.domain.pcresource.Ornament'
            },
            {
                display: 'DynamicSizeImage',
                value: 'com.qpp.cgp.domain.pcresource.dynamicimage.DynamicSizeImage',
                url: adminPath + 'api/dynamicSizeImages'
            },
            {
                display: 'Image',
                value: 'com.qpp.cgp.domain.pcresource.Image',
                url: adminPath + 'api/images'
            },
            {
                display: 'CompositeDisplayObject',
                value: 'com.qpp.cgp.domain.pcresource.compositedisplayobject.CompositeDisplayObject',
                url: adminPath + 'api/compositeDisplayObjects'
            }
        ]

    }


})