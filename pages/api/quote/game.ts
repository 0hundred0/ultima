// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { GameData } from '../../../src/types'
import { supabase } from '../../../src/lib/supaclient'
import _ from 'lodash';
import { getSingleRandom } from '../../../src/utils/getSingleRandom';

// GET quote/game?title=gameTitle
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GameData | String>
) {
	const query = req.query;
	let { title } = query;
	if(title) {
	 	try {
			title = title.toString().replace(/\w+/g, _.capitalize);
	
			const { 
				data: game, error, status
			} = await supabase
				.from('Quotes')
				.select(`*`)
				.eq('title', title)
			
			if(error && status !== 406) {
				throw error
			}
			if(game && game.length > 0) {
				res.json(getSingleRandom(game));
			} else {
				throw error
			}
		} catch(error) {
			res.send("Not Found")
		}
	} else {
		res.send("No title entered")
	}
}