import React, { useState } from 'react'
import { Button } from '@chakra-ui/react'
import { useAccount, useContract, useSigner } from 'wagmi'
import contracts from '../../json/contracts.json'
export const Contract = () => {
    const [{ data: accountData }, disconnect] = useAccount();
    const [res, setRes] = useState('')
    const [{ data, error, loading }, getSigner] = useSigner()

    /*const contract = useContract({
        addressOrName: contracts.rinkeby.crud.address,
        contractInterface: contracts.rinkeby.crud.abi,
        signerOrProvider: data,
    })

    async function read() {
        try {
            let result = await contract.read(2)
            console.log(result[1])
            setRes(result[1])
        } catch (e) {
            alert(e)
        }
    }
    if (accountData) {
        return (<><Button onClick={read} >invia</Button> {res} </>)
    }*/
    return (<></>)
}