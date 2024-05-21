export interface INavigationRoute {
  name: string
  displayName: string
  meta: { icon: string }
  children?: INavigationRoute[]
}

export default {
  root: {
    name: '/',
    displayName: 'navigationRoutes.home',
  },
  routes: [
    {
      name: 'clients',
      displayName: 'menu.clients',
      meta: {
        icon: 'group',
      },
    },
    {
      name: 'editor',
      displayName: 'editor.editor',
      meta: {
        icon: 'vuestic-iconset-image',
      },
    },
    {
      name: 'sensors',
      displayName: 'menu.sensors',
      meta: {
        icon: 'book',
      },
    },
    {
      name: 'settings',
      displayName: 'menu.settings',
      meta: {
        icon: 'settings',
      },
    },
  ] as INavigationRoute[],
}
