const URL = `https://${
  import.meta.env.VITE_PROJECT_ID
}.api.sanity.io/v2021-10-21/data/query/production?query=`

export async function getHomeImages() {
  return new Promise(async resolve => {
    // let queryEncoded = encodeURIComponent(
    //   '*[_type == "studyItems"]{image.asset->url}'
    // )
    let queryEncoded = encodeURIComponent(
      `*[_type == "studyItems"]{websiteUrl, title, image{'asset': asset->url, 'palette': asset->metadata.palette, 'dimensions': asset->metadata.dimensions, 'lqip': asset->metadata.lqip, 'blurhash': asset->metadata.blurhash}}`,
    )
    let queryUrl = URL + queryEncoded
    const {result} = await fetch(queryUrl).then(res => res.json())

    return resolve(result)
  })
}
