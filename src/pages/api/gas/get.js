export default async function handler(req, res) {
   const response = await fetch('https://gpoly.blockscan.com/gasapi.ashx?apikey=key&method=gasoracle')
   const jsonData = await response.json()
    res.status(200).json(jsonData)
}