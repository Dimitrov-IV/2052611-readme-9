import { Expose } from "class-transformer";
import { BlogPostRdo } from "./post.rdo";
import { ApiProperty } from "@nestjs/swagger";

export class PostWithPaginationRdo {
	@ApiProperty({
		type: [BlogPostRdo]
	})
	@Expose()
	public entities: BlogPostRdo[];

	@ApiProperty()
	@Expose()
	public totalPages: number;

	@ApiProperty()
	@Expose()
	public totalItems: number;

	@ApiProperty()
	@Expose()
	public currentPage: number;

	@ApiProperty()
	@Expose()
	public itemsPerPage: number;
}