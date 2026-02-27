/**
 * @Description:
 * @author nan
 * @date 2023/7/5
 */
Ext.define('CGP.promotion.store.Promotion', {
    extend: 'Ext.data.Store',
    model: 'CGP.promotion.model.Promotion',
    autoLoad: true,
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/promotion',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    remoteSort: true,
    sorters: [
        {
            property: '_id',
            direction: 'DESC'
        }
    ],
})