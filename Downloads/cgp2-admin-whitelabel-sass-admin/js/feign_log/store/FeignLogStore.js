/**
 * Created by nan on 2019/6/27.
 */
Ext.define('CGP.feign_log.store.FeignLogStore', {
    extend: 'Ext.data.Store',
    requires: ['CGP.feign_log.model.FeignLogModel'],
    model: 'CGP.feign_log.model.FeignLogModel',
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/feignLogInfo',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    sorters: [{
        property: 'createdDate',
        direction: 'DESC'
    }],
    autoLoad: true

})
