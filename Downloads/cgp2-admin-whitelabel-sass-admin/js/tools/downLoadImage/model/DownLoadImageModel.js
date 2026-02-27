/**
 * @author xiu
 * @date 2024/7/29
 */
Ext.define('CGP.tools.downLoadImage.model.DownLoadImageModel', {
    extend: 'Ext.data.Model',
    idProperty: 'imageId',
    fields: [
        {
            name: 'imageName',
            type: 'string',
        },
        {
            name: 'imageId',
            type: 'string',
        },
        {
            name: 'productInstanceId',
            type: 'string',
        },
        {
            name: 'message',
            type: 'string',
        },
        {
            name: 'isSuccess',
            type: 'string',
            defaultValue: 'waiting'
        },
    ],
})